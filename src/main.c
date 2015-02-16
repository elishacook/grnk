#include <stdio.h>
#include <portaudio.h>
#include "audio/audio.h"
#include "audio/table.h"
#include "audio/unit.h"

static PaError err;
#define PA(call) err = Pa_##call; if (err != paNoError) goto error

static int paTestCallback(const void *inputBuffer,
						  void *outputBuffer,
						  unsigned long framesPerBuffer,
						  const PaStreamCallbackTimeInfo* timeInfo,
						  PaStreamCallbackFlags statusFlags,
						  void *userData)
{
	audio_unit_instance *sinosc = (audio_unit_instance *)userData;
	audio_unit_process(sinosc, inputBuffer, outputBuffer, framesPerBuffer, timeInfo->currentTime);
	return 0;
}


int main(void)
{
	audio_unit_instance *sinosc = audio_unit_create(&audio_unit_sin);
	
	if (!sinosc)
	{
		printf("Error: could not create sin audio unit.\n");
		return 1;
	}
	
	PA(Initialize());
	
	PaStream *stream;
	err = Pa_OpenDefaultStream(
		&stream,
		0,
		2,
		paFloat32,
		SAMPLE_RATE,
		paFramesPerBufferUnspecified,
		paTestCallback,
		(void *)sinosc
	);
	if (err != paNoError) goto error;
	
	err = Pa_StartStream(stream);
	if (err != paNoError) goto error;
	
	Pa_Sleep(3000);
	
	err = Pa_StopStream(stream);
	if (err != paNoError) goto error;
	
	err = Pa_Terminate();
	if (err != paNoError) goto error;
	
	audio_unit_destroy(sinosc);
	
	return 0;
	
	error:
		printf("PortAudio error: %s\n", Pa_GetErrorText(err));
		return 1;
}