<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Chain;
use App\ChainManager;
use App\Http\Requests\Chain\CreateRequest;
use App\Http\Requests\Chain\SaveRequest;
use App\Services\CurrentPeriodResolver;
use App\Services\Factories\ChainFactory;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChainController extends Controller
{
    public function create(
        CreateRequest $request,
        ChainFactory $chainFactory,
        CurrentPeriodResolver $currentPeriodResolver
    ): Chain {
        return $chainFactory->createChain([
            'name'    => $request->get('name'),
            'wplp_id' => $currentPeriodResolver->getPeriod()->wplp_id,
        ]);
    }

    public function save(SaveRequest $request, ChainManager $chainManager, Chain $chain): Chain
    {
        $status = $request->get('status', null);
        // We need to manually cast it to int, in transport it is a string
        // However updateChain allows null values, but casting a null to int gives 0, which is a valid status
        // So first check if it is a value
        if (is_string($status)) {
            $status = (int) $status;
        }

        $chainManager->updateChain($chain, $request->get('name'), $status);

        return $chain;
    }

    public function delete(Chain $chain, ChainManager $chainManager, Request $request)
    {
        $chainManager->deleteChain($chain);
        if ($request->headers->has('referer')) {
            return redirect($request->headers->get('referer'));
        }

        return new Response('', 200);
    }
}
