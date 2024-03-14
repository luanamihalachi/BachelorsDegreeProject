package com.example.qrcodescanner;

import android.util.Log;
import android.widget.TextView;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpRequest {
    public static int sendPostRequest(String url, String message) throws IOException {
        URL endpoint = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) endpoint.openConnection();

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            System.out.println(connection);

            String jsonInputString = "{\"message\": \"" + message + "\"}";
            try (OutputStream os = connection.getOutputStream()) {

                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);

            int responseCode = connection.getResponseCode();
            return responseCode;

        } finally {
            connection.disconnect();
        }
    }
}