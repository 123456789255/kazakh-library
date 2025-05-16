<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePasswordResetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('cover_path'); //image
            $table->string('file_path'); //url
            $table->integer('year');
            $table->string('language');
            $table->bitint('author_id'); //id автора
            $table->foreignId('author_id')->constrained('authors');
            $table->bitint('genre_id'); //id жанра
            $table->foreignId('genre_id')->constrained('genres');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('password_resets');
    }
}
