# Generated by Django 5.1.7 on 2025-04-09 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0008_alter_item_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='consumed_quantity',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='inventory',
            name='purchased_quantity',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='inventory',
            name='returned_quantity',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='no',
            field=models.CharField(blank=True, max_length=20, unique=True),
        ),
    ]
