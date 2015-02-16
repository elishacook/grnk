#ifndef __AUDIO_UNIT_H__
#define __AUDIO_UNIT_H__


typedef void * (*audio_unit_create_callback)();

typedef void (*audio_unit_destroy_callback)(void *);

typedef void (*audio_unit_process_callback)(
		const float *input, 
		float *output, 
		unsigned long frames,
		double time,
		void *unit_data
);

typedef struct 
{
	char *name;
	unsigned input_ports;
	const char **input_port_names;
	unsigned output_ports;
	const char **output_port_names;
	audio_unit_create_callback create;
	audio_unit_destroy_callback destroy;
	audio_unit_process_callback process;
} audio_unit;

typedef struct
{
	audio_unit *unit;
	void *data;
} audio_unit_instance;

audio_unit_instance *audio_unit_create(audio_unit *);

void audio_unit_destroy(audio_unit_instance *);

void audio_unit_process(audio_unit_instance *, const float *input, float *output, unsigned long frames, double time);

#endif