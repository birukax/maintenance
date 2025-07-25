# Generated by Django 5.1.7 on 2025-06-16 07:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("inventory", "0028_transferhistory_completed"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="inventory",
            options={
                "ordering": ["item__no", "location__code"],
                "verbose_name_plural": "inventories",
            },
        ),
        migrations.AlterField(
            model_name="item",
            name="name",
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
