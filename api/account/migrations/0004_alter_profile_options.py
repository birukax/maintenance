# Generated by Django 5.1.7 on 2025-05-15 10:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_profile_created_at_profile_updated_at'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='profile',
            options={'ordering': ['-created_at']},
        ),
    ]
