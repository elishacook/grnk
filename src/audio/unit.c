#include <stdlib.h>
#include "unit.h"


audio_unit_instance *audio_unit_create(audio_unit *unit)
{
	audio_unit_instance *unit_instance = (audio_unit_instance *) malloc(sizeof(audio_unit_instance));
	
	if (!unit_instance)
	{
		return NULL;
	}
	
	unit_instance->unit = unit;
	unit_instance->data = unit->create();
	
	return unit_instance;
}


void audio_unit_destroy(audio_unit_instance *unit_instance)
{
	if (!unit_instance)
	{
		return;
	}
	
	if (unit_instance->unit)
	{
		unit_instance->unit->destroy(unit_instance->data);
	}
	
	free(unit_instance);
}


void audio_unit_process(
	audio_unit_instance *unit_instance, 
	const float *input, 
	float *output, 
	unsigned long frames, 
	double time)
{
	unit_instance->unit->process(input, output, frames, time, unit_instance->data);
}