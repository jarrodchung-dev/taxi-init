# Generated by Django 2.2.5 on 2019-09-12 04:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0004_trip_driver_rider'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='photos'),
        ),
    ]
