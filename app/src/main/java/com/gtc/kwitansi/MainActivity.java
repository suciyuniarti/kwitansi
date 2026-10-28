package com.gtc.kwitansi;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final String APP_DIR = "KwitansiDigital";

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        webView.addJavascriptInterface(new AndroidInterface(), "AndroidInterface");

        webView.loadUrl("file:///android_asset/web/index.html");
    }

    public class AndroidInterface {
        @JavascriptInterface
        public void saveImage(String base64Data, String fileName) {
            runOnUiThread(() -> {
                try {
                    // Remove data URL prefix if present
                    String pureBase64 = base64Data;
                    if (base64Data.contains(",")) {
                        pureBase64 = base64Data.split(",")[1];
                    }
                    
                    byte[] decodedBytes = android.util.Base64.decode(pureBase64, android.util.Base64.DEFAULT);
                    
                    File directory;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        directory = new File(getExternalFilesDir(null), APP_DIR);
                    } else {
                        directory = new File(android.os.Environment.getExternalStoragePublicDirectory(
                                android.os.Environment.DIRECTORY_DOWNLOADS), APP_DIR);
                    }
                    
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    
                    // Clean filename
                    String safeFileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_") + ".jpg";
                    File file = new File(directory, safeFileName);
                    
                    FileOutputStream fos = new FileOutputStream(file);
                    fos.write(decodedBytes);
                    fos.close();
                    
                    Toast.makeText(MainActivity.this, "Kwitansi berhasil disimpan: " + file.getAbsolutePath(), Toast.LENGTH_LONG).show();
                    
                    // Notify gallery
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                        Uri contentUri = Uri.fromFile(file);
                        mediaScanIntent.setData(contentUri);
                        sendBroadcast(mediaScanIntent);
                    }
                    
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Gagal menyimpan: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
        }

        @JavascriptInterface
        public void shareImage(String base64Data, String fileName) {
            runOnUiThread(() -> {
                try {
                    String pureBase64 = base64Data;
                    if (base64Data.contains(",")) {
                        pureBase64 = base64Data.split(",")[1];
                    }
                    
                    byte[] decodedBytes = android.util.Base64.decode(pureBase64, android.util.Base64.DEFAULT);
                    
                    File cachePath = new File(getCacheDir(), "images");
                    cachePath.mkdirs();
                    
                    String safeFileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_") + ".jpg";
                    File file = new File(cachePath, safeFileName);
                    
                    FileOutputStream fos = new FileOutputStream(file);
                    fos.write(decodedBytes);
                    fos.close();
                    
                    Uri contentUri = FileProvider.getUriForFile(MainActivity.this,
                            getPackageName() + ".fileprovider", file);
                    
                    Intent shareIntent = new Intent(Intent.ACTION_SEND);
                    shareIntent.setType("image/jpeg");
                    shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                    shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    
                    startActivity(Intent.createChooser(shareIntent, "Bagikan Kwitansi"));
                    
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Gagal berbagi: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
        }

        @JavascriptInterface
        public void showToast(String message) {
            runOnUiThread(() -> Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show());
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
