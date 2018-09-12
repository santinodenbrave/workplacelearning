<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Translation\Translator;

class LearningActivityActingExportBuilder
{
    private $learningActivityActingCollection;

    public function __construct(Collection $learningActivityActingCollection)
    {
        $this->learningActivityActingCollection = $learningActivityActingCollection;
    }

    public function getJson()
    {
        $jsonArray = [];
        $this->learningActivityActingCollection->each(function (LearningActivityActing $activity) use (&$jsonArray): void {
            $jsonArray[] = [
                'id' => $activity->laa_id,
                'date' => Carbon::createFromFormat('Y-m-d', $activity->date)->format('d-m-Y'),
                'situation' => $activity->situation,
                'timeslot' => __($activity->timeslot->timeslot_text),
                'resourcePerson' => __($activity->resourcePerson->person_label),
                'resourceMaterial' => __($activity->resourceMaterial ? $activity->resourceMaterial->rm_label : 'activity.none'),
                'learningGoal' => __($activity->learningGoal->learninggoal_label),
                'competence' => __($activity->competence->first()->competence_label),
                'learningGoalDescription' => $activity->learningGoal->description,
                'lessonsLearned' => $activity->lessonslearned,
                'supportWp' => $activity->support_wp ?? '',
                'supportEd' => $activity->support_ed ?? '',
                'url' => route('process-acting-edit', ['id' => $activity->laa_id]),
                'evidence' => $activity->evidence_filename === null ? '-' :
                    route('evidence-download', ['id' => $activity->laa_id, 'diskFileName' => $activity->evidence_disk_filename]),
            ];
        });

        return json_encode($jsonArray);
    }

    public function getFieldLanguageMapping(Translator $translator): array
    {
        $mapping = [];
        collect([
            'date',
            'situation',
            'timeslot',
            'resourcePerson',
            'resourceMaterial',
            'lessonsLearned',
            'learningGoal',
            'learningGoalDescription',
            'supportWp',
            'supportEd',
            'competence',
             'evidence',
        ])->each(function ($field) use (&$mapping, $translator): void { $mapping[$field] = $translator->get('process_export.'.$field); });

        return $mapping;
    }
}
