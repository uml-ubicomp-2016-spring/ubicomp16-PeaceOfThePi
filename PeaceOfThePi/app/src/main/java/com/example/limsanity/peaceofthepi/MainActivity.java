package com.example.limsanity.peaceofthepi;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;
import android.media.MediaRecorder.OutputFormat;
import android.media.MediaRecorder.AudioEncoder;

import java.io.IOException;
//import android.support.v7.app.AppCompatActivity;


public class MainActivity extends Activity implements LocationListener {

    //AppCompatActivity
    //private static final int PERIOD=180000; //3 min
    //private PendingIntent pi=null;

    private LocationManager locationManager;
    private MediaRecorder mediaRecorder;

    int MY_PERMISSION_ACCESS_COURSE_LOCATION = 1000;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button stopBtn = (Button) findViewById(R.id.stopRecording);
        Button getBtn = (Button) findViewById(R.id.getSoundBtn);


        mediaRecorder = new MediaRecorder();
        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setOutputFormat(OutputFormat.MPEG_4);
        mediaRecorder.setAudioEncoder(AudioEncoder.AAC);
        try {
            mediaRecorder.prepare();
            mediaRecorder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }


        if ( ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED ) {

            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION},
                    MY_PERMISSION_ACCESS_COURSE_LOCATION);
        }

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, this);
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 0, this);

        getBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Toast.makeText(getBaseContext(), mediaRecorder.getMaxAmplitude(), Toast.LENGTH_LONG).show();
                //Toast.makeText(getBaseContext(), "Hello " + mediaRecorder.getMaxAmplitude(), Toast.LENGTH_LONG).show();
                mediaRecorder.getMaxAmplitude();
                System.out.println(mediaRecorder.getMaxAmplitude());
            }
        });
        stopBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mediaRecorder.stop();
                mediaRecorder.release();
            }
        });

        /*


        TextView locationLabel = (TextView) findViewById(R.id.locationText);
        AlarmManager mgr=(AlarmManager)getSystemService(ALARM_SERVICE);

        Intent i=new Intent(this, LocationPoller.class);

        i.putExtra(LocationPoller.EXTRA_INTENT,
                new Intent(this, LocationReceiver.class));
        i.putExtra(LocationPoller.EXTRA_PROVIDER,
                LocationManager.NETWORK_PROVIDER);

        pi=PendingIntent.getBroadcast(this, 0, i, 0);
        mgr.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,
                SystemClock.elapsedRealtime(),
                PERIOD,
                pi);

        Location loc=(Location)i.getExtras().get(LocationPoller.EXTRA_LOCATION);
        String msg;



        if (loc==null) {
            msg=i.getStringExtra(LocationPoller.EXTRA_ERROR);
        }
        else {
            msg=loc.toString();
        }

        locationLabel.setText("Loading...");

        if (msg==null) {
            msg="Invalid broadcast received!";
        }

        locationLabel.setText(msg);

        */

    }

    @Override
    public void onLocationChanged(Location location) {

        String msg = "New Latitude: " + location.getLatitude()
                + "New Longitude: " + location.getLongitude();

        //Log.v("Change", "IN ON LOCATION CHANGE, lat=" + location.getLatitude() + ", lon=" + location.getLongitude());
        //Toast.makeText(getBaseContext(), msg, Toast.LENGTH_LONG).show();



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


}
