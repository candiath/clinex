## Appointment
Representa un turno médico entre un paciente y un profesional en un intervalo de tiempo determinado

### Invariantes
- un **Appointment** siempre tiene un estado válido
- un **Appointment** no puede volver a estados anteriores
- un **Appointment** `COMPLETED` no puede ser modificado
- un **Appointment** tiene un rango horario coherente

### Estados
- SCHEDULED
- CONFIRMED
- IN_PROGRESS
- COMPLETED
- CANCELLED
- NO_SHOW

### Transiciones válidas

SCHEDULED → CONFIRMED | CANCELLED  
CONFIRMED → IN_PROGRESS | CANCELLED  
IN_PROGRESS → COMPLETED | NO_SHOW  
COMPLETED → (ninguna)  
CANCELLED → (ninguna)  
NO_SHOW → (ninguna)


### Comportamientos

- Cambiar estado del turno
- Reprogramar turno
- Cancelar turno

### Casos de uso

- CreateAppointment
- UpdateAppointmentStatus
- RescheduleAppointment
- CancelAppointment

### Inputs esperados

- status: string (enum)
- date: ISO string


SCHEDULED|    → CONFIRMED      | → IN_PROGRESS| → COMPLETED
    :---        :---            :---              :--- 
|     ↓      |       ↓      |
| CANCELLED  |    NO_SHOW   |
