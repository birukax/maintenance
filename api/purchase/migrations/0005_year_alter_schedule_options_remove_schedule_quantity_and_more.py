# Generated by Django 5.1.7 on 2025-04-29 10:34

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0019_alter_item_minimum_stock_level'),
        ('purchase', '0004_alter_schedule_options_schedule_april_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Year',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('no', models.IntegerField(validators=[django.core.validators.MinValueValidator(2025), django.core.validators.MaxValueValidator(2026)])),
            ],
            options={
                'ordering': ['-no'],
            },
        ),
        migrations.AlterModelOptions(
            name='schedule',
            options={'ordering': ['-year__no', 'item__name']},
        ),
        migrations.RemoveField(
            model_name='schedule',
            name='quantity',
        ),
        migrations.AlterField(
            model_name='schedule',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='purchase_schedules', to='inventory.item'),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='year',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='schedules', to='purchase.year'),
        ),
    ]
