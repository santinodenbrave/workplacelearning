<?php
/**
 * This file (ProducingAnalysisController.php) was created on 08/31/2016 at 14:15.
 * (C) Max Cassee
 * This project was commissioned by HU University of Applied Sciences.
 */

namespace App\Http\Controllers;

use App\Analysis\Producing\ProducingAnalysis;
use App\Analysis\Producing\ProducingAnalysisCollector;
use App\Cohort;
use App\Repository\Eloquent\LikeRepository;
use App\Repository\StudentTipViewRepositoryInterface;
use App\Student;
use App\Tips\EvaluatedTipInterface;
use App\Tips\Services\ApplicableTipFetcher;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Lang;

class ProducingAnalysisController extends Controller
{
    public function showChoiceScreen(Student $student)
    {
        // Check if for the workplace the user has hours registered
        if (!$student->getCurrentWorkplaceLearningPeriod()->hasLoggedHours()) {
            return redirect()->route('home-producing')->withErrors([Lang::get('notifications.generic.nointernshipregisteredactivities')]);
        }

        return view('pages.producing.analysis.choice')
            ->with('numdays', (new ProducingAnalysisCollector())->getFullWorkingDays('all', 'all'));
    }

    public function showDetail(Request $request, $year, $month, ApplicableTipFetcher $applicableTipFetcher, LikeRepository $likeRepository, StudentTipViewRepositoryInterface $studentTipViewRepository)
    {
        // Check valid date options
        if (('all' !== $year && 'all' !== $month)
            && (!preg_match('/^(20)(\d{2})$/', $year) || !preg_match('/^([0-1]{1}\d{1})$/', $month))
        ) {
            return redirect()->route('analysis-producing-choice');
        }

        // Create new Analysis for the producing student
        $producingAnalysis = new ProducingAnalysis(new ProducingAnalysisCollector(), $year, $month);

        if ('all' === $year || 'all' === $month) {
            $year = null;
            $month = null;
        }
        $workplaceLearningPeriod = $request->user()->getCurrentWorkplaceLearningPeriod();

        /** @var Cohort $cohort */
        $cohort = $workplaceLearningPeriod->cohort;

        $applicableEvaluatedTips = collect($applicableTipFetcher->fetchForCohort($cohort));

        /** @var Student $student */
        $student = $request->user();

        $evaluatedTips = $applicableEvaluatedTips->filter(function (EvaluatedTipInterface $evaluatedTip) use (
            $student,
            $likeRepository
        ) {
            $likeRepository->loadForTipByStudent($evaluatedTip->getTip(), $student);

            // If not liked by this student yet, allow it to be shown
            if (0 === $evaluatedTip->getTip()->likes->count()) {
                return true;
            }

            // If liked, allow, if disliked filter it out
            return 1 === $evaluatedTip->getTip()->likes[0]->type;
        })->shuffle()->take(3);

        // Register that the tip will be viewed by the student
        $evaluatedTips->each(function (EvaluatedTipInterface $evaluatedTip) use ($student, $studentTipViewRepository): void {
            $studentTipViewRepository->createForTip($evaluatedTip->getTip(), $student);
        });

        // Get the raw data of the analysis, used in the view
        $analysisData = $producingAnalysis->analysisData;

        return view('pages.producing.analysis.detail')
            ->with('evaluatedTips', $evaluatedTips)
            ->with('producingAnalysis', $producingAnalysis)
            ->with('analysis', $analysisData)
            ->with('year', $year)
            ->with('monthno', $month);
    }
}
