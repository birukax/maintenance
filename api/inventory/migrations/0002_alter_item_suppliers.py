# Generated by Django 5.1.7 on 2025-03-28 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='suppliers',
            field=models.ManyToManyField(blank=True, related_name='items', to='inventory.contact'),
        ),
    ]
