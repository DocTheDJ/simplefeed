# Generated by Django 4.1.5 on 2023-03-22 17:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('simplefeed', '0003_alter_category_original_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='availabilities',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='availab', to='simplefeed.feeds'),
        ),
    ]
