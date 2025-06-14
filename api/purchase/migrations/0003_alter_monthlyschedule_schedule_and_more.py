# Generated by Django 5.1.7 on 2025-04-28 15:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0019_alter_item_minimum_stock_level'),
        ('purchase', '0002_alter_schedule_item_alter_schedule_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='monthlyschedule',
            name='schedule',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='monthly_schedule', to='purchase.schedule'),
        ),
        migrations.AlterUniqueTogether(
            name='schedule',
            unique_together={('item', 'year')},
        ),
    ]
