@extends('layouts.HUdefault')
@section('title')
    Home
@stop
@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-7">
                <h1>{{ __('dashboard.title') }}</h1>

                <p>{{ __('home.welcome-teacher') }}
            </div>
        </div>
    </div>
@stop
