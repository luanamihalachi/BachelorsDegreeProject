package com.example.qrcodescanner;

import android.annotation.SuppressLint;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;

public class SuccessActivity extends AppCompatActivity {
    public TextView messageTextView;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_success);
        messageTextView = findViewById(R.id.messageTextView);

        String message = getIntent().getStringExtra("message");

        if (message != null) {
            System.out.println(message);

            String nodeJsEndpoint = "http://192.168.100.13:8000/api/no-login/scanQrCode";

            @SuppressLint("StaticFieldLeak")
            AsyncTask<String, Void, Void> task = new SendPostRequestTask();
            task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, nodeJsEndpoint, message);

        }
    }

    @SuppressLint("StaticFieldLeak")
    private class SendPostRequestTask extends AsyncTask<String, Void, Void> {
        @Override
        protected Void doInBackground(String... params) {
            String url = params[0];
            String message = params[1];
            int responseCode = 0;
            try {
                responseCode = HttpRequest.sendPostRequest(url, message);
                if (responseCode == 200)
                    messageTextView.setText("Cod scanat cu succes!");
                else messageTextView.setText("Eroare la scanarea codului!");
            } catch (IOException e) {
                messageTextView.setText("Eroare la scanarea codului!");
                e.printStackTrace();


            }


            return null;
        }
    }
}
