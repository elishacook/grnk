#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include "audio.h"
#include "table.h"

#define M_PI 3.14159265358979323846264338327
#define TABLE_SIZE 1024

typedef struct
{
	bool is_loaded;
	float data[TABLE_SIZE];
} lookup_table;

lookup_table sin_table = { .is_loaded=false };

typedef struct
{
	float phase;
	float freq;
	float amp;
} sin_data;


static void * sin_create()
{
	if (!sin_table.is_loaded)
	{
		sin_table.is_loaded = true;

		for (unsigned i=0; i<TABLE_SIZE; i++)
		{
			sin_table.data[i] = sin(2 * M_PI * i / TABLE_SIZE);
		}
	}

	sin_data *data = (sin_data *) malloc(sizeof(sin_data));

	if (!data)
	{
		return NULL;
	}

	data->phase = 0.0f;
	data->freq = 440.0f;
	data->amp = 0.0f;

	return (void *)data;
}


static void sin_destroy(void *data)
{
	if (data)
	{
		free(data);
	}
}

static void sin_process(
		const float *input, 
		float *output, 
		unsigned long frames,
		double time,
		void *user_data)
{
	sin_data *data = (sin_data *) user_data;
	
	for (unsigned i=0; i<frames; i++)
	{
		unsigned x = floor(data->phase);
		float y1 = sin_table.data[x];
		float y2 = sin_table.data[(x+1)%TABLE_SIZE];
		float value = y1 + (y2-y1) * (data->phase - x) * data->amp;
		*output++ = value;
		*output++ = value;
		data->phase += TABLE_SIZE * data->freq / SAMPLE_RATE;
		if (data->phase > TABLE_SIZE) data->phase -= TABLE_SIZE;
	}
}

audio_unit audio_unit_sin = 
{
	.name = "Sin",
	.output_ports = 1,
	.output_port_names = (const char *[]) { "out" },
	.create = sin_create,
	.destroy = sin_destroy,
	.process = sin_process
};
