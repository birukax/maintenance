# Generated by Django 5.1.7 on 2025-04-23 11:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('work_order', '0015_workorder_end_date_workorder_end_time_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='workorder',
            old_name='date',
            new_name='start_date',
        ),
    ]
