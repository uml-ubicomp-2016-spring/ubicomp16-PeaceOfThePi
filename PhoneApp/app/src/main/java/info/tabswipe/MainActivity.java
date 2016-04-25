package info.tabswipe;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.example.limsanity.peaceofthepi.R;
import com.github.lzyzsd.circleprogress.DonutProgress;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends Activity implements LocationListener {

    private LocationManager locationManager;
    private MediaRecorder mediaRecorder;
    private DonutProgress donutProgress;
    private double dB;

    int MY_PERMISSION_ACCESS_COURSE_LOCATION = 1000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //instantiate DonutProgress
        donutProgress = (DonutProgress) findViewById(R.id.donut_progress);

        //instantiate delete data btn
        Button deleteDataBaseBtn = (Button) findViewById(R.id.deleteDBBtn);
        //instantiate get sound btn
        Button getSoundBtn = (Button) findViewById(R.id.getAmpBtn);

        //call startRecording function to start mediaRecorder
        startRecording();

        //check for location permission
        //檢查位置的權限
        if ( ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ) {

            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION},
                    MY_PERMISSION_ACCESS_COURSE_LOCATION);
        }

        //instantiate LocationManager
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);


        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 0, this);

        getSoundBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getAmp();

            }
        });

        deleteDataBaseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                deleteRequest("10.253.95.190", "soundLocation");
            }
        });

    }

    private void getAmp() {

        donutProgress.post(new Runnable() {
            @Override
            public void run() {
                    donutProgress.setProgress((int)dB);
                }

        });

    }

    /*

     */
    private void startRecording() {
        String mFileName = "/dev/null";
        String LOG_TAG = "Recording";
        mediaRecorder = new MediaRecorder();
        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        mediaRecorder.setOutputFile(mFileName);
        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new RecorderTask(mediaRecorder), 0, 500);
        try {
            mediaRecorder.prepare();
        } catch (IOException e) {
            Log.e(LOG_TAG, "prepare() failed");
        }

        mediaRecorder.start();

        //Toast.makeText(getApplicationContext(),mediaRecorder.getMaxAmplitude(), Toast.LENGTH_LONG);
    }

    private void stopRecording() {

        mediaRecorder.stop();
        mediaRecorder.release();
        mediaRecorder = null;
    }

    private void deleteRequest(final String ip, final String collection) {

        new AsyncTask<Void, Void, Void>(){

            @Override
            protected Void doInBackground(Void... params) {

                HttpClient httpClient = new DefaultHttpClient();
                HttpDelete httpDelete = new HttpDelete("http://" + ip + ":3000/" + collection + "/");

                try {
                    HttpResponse response = httpClient.execute(httpDelete);
                    // write response to log
                    Log.d("Http Delete Response:", response.toString());
                } catch (ClientProtocolException e) {
                    // Log exception
                    e.printStackTrace();
                } catch (IOException e) {
                    // Log exception
                    e.printStackTrace();
                }
                return null;
            }
        }.execute();
    }
    private void postRequest(final String xCoordinate, final String yCoordinate, final String time, final String date) {
        new AsyncTask<Void, Void, Void>(){

            @Override
            protected Void doInBackground(Void[] params) {
                HttpClient httpClient = new DefaultHttpClient();
                HttpPost httpPost = new HttpPost("http://10.253.95.190:3000/soundLocation/");

                Log.d("Test", "inPostRequest");
                List<NameValuePair> soundLocationPair = new ArrayList<>();
                soundLocationPair.add(new BasicNameValuePair("X_coordinate", xCoordinate));
                soundLocationPair.add(new BasicNameValuePair("Y_coordinate", yCoordinate));
                soundLocationPair.add(new BasicNameValuePair("Decibel", String.valueOf(dB)));
                soundLocationPair.add(new BasicNameValuePair("Time", time));
                soundLocationPair.add(new BasicNameValuePair("Date", date));

                Log.d("Test", "inPostRequest Out");
                //Encoding POST data
                try {

                    httpPost.setEntity(new UrlEncodedFormEntity(soundLocationPair));

                } catch (UnsupportedEncodingException e)
                {
                    e.printStackTrace();
                }

                try {
                    HttpResponse response = httpClient.execute(httpPost);
                    // write response to log
                    Log.d("Http Post Response:", response.toString());
                } catch (ClientProtocolException e) {
                    // Log exception
                    Log.d("Test: ", "Error in First catch" );
                    e.printStackTrace();
                } catch (IOException e) {
                    // Log exception
                    Log.d("Test: ", "Error in Second catch" );
                    e.printStackTrace();
                }
                return null;
            }
        }.execute();
    }
    @Override
    public void onLocationChanged(Location location) {


        String msg = "New Latitude: " + location.getLatitude()
                + " New Longitude: " + location.getLongitude();

        if ( ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ) {

            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION},
                    MY_PERMISSION_ACCESS_COURSE_LOCATION);
        }

        Date var = new Date();
        DateFormat date = DateFormat.getDateInstance();
        String gmtTime = String.valueOf(var.getHours()) + ":" + String.valueOf(var.getMinutes()) + ":" + String.valueOf(var.getSeconds());
        date.setTimeZone(TimeZone.getTimeZone("GMT-4"));
        String gmtDate = date.format(new Date());

        postRequest(Double.toString(location.getLatitude()), Double.toString(location.getLongitude()), gmtTime, gmtDate);
        Toast.makeText(getBaseContext(), msg, Toast.LENGTH_LONG).show();

    }

    @Override
    public void onProviderDisabled(String provider) {

        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivity(intent);
        Toast.makeText(getBaseContext(), "Gps is turned off!! ",
                Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onProviderEnabled(String provider) {

        Toast.makeText(getBaseContext(), "Gps is turned on!! ",
                Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        // TODO Auto-generated method stub

    }

    private class RecorderTask extends TimerTask {
        private MediaRecorder recorder;

        public RecorderTask(MediaRecorder recorder) {
            this.recorder = recorder;
        }

        public void run() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    int amplitude = recorder.getMaxAmplitude();
                    double amplitudeDb = 20 * Math.log10((double)Math.abs(amplitude));
                    dB = amplitudeDb;
                    getAmp();
                }
            });
        }
    }
}

