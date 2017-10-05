<?php


namespace App;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CompetenceDescription extends Model
{

    public function educationProgram() {
        return $this->belongsTo(EducationProgram::class, 'ep_id', 'education_program_id');
    }

    public $timestamps = false;

    protected $appends = ['has_data', 'download-url'];

    /**
     * @return bool whether this description exists and has data
     */
    public function getHasDataAttribute() {
        return Storage::disk('local')->exists($this->file_name);
    }

    /**
     * @return string the url to follow to download this description
     */
    public function getDownloadUrlAttribute() {
        return route('competence-description', ['id' => $this->id]);
    }

    /**
     * @return string the unique file name for this description
     */
    public function getFileNameAttribute() {
        return "competence-descriptions/competence-description-{$this->id}.pdf";
    }

}