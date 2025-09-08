# 🏥 Clinex - Sistema de Gestión Hospitalaria

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Latest-orange.svg)](https://www.mysql.com/)
[![Jest](https://img.shields.io/badge/Jest-30.0.3-red.svg)](https://jestjs.io/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-brightgreen.svg)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 📖 Tabla de Contenidos

- [🎯 Visión General](#-visión-general)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Características](#-características)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🔒 Seguridad](#-seguridad)

---

## 🎯 Visión General

**Clinex** es un sistema de gestión hospitalaria ~~completo~~ (en desarrollo) pensado como proyecto de portafolio. Está diseñado para manejar las operaciones críticas de instituciones médicas con alta concurrencia y estándares profesionales.

### 💡 Propósito

Este proyecto demuestra:
- ✅ **Arquitectura Limpia** con separación clara de responsabilidades
- ✅ **Testing Comprehensivo** con ~100% de cobertura
- ✅ **Escalabilidad Enterprise** para sistemas de alta concurrencia (migración futura a microservicios)
- ✅ **Dominio Complejo** con lógica de negocio sofisticada
- ✅ **Estándares Profesionales** en código, documentación y tratamiento de datos sensibles

---

## 🏗️ Arquitectura

### Clean Architecture Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  Controllers • Routes • Middlewares • Error Handling       │
├─────────────────────────────────────────────────────────────┤
│                    Domain Layer                             │
│  Entities • Use Cases • DTOs • Interfaces • Business Logic │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│  Repositories • Datasources • External Services • Database │
└─────────────────────────────────────────────────────────────┘
```

### 📁 Estructura del Proyecto

```
src/
├── presentation/          # 🌐 API Layer
│   ├── controllers/       # Request/Response handling
│   ├── routes/           # Route definitions
│   ├── middlewares/      # Custom middlewares
│   └── server.ts         # Express server setup
│
├── domain/               # 🧠 Business Logic
│   ├── entities/         # Core business entities
│   ├── usecases/         # Business use cases
│   ├── dtos/            # Data transfer objects
│   ├── interfaces/       # Domain interfaces
│   ├── repositories/     # Repository contracts
│   ├── datasources/      # Datasource contracts
│   ├── errors/          # Custom error types
│   └── helpers/         # Domain helpers
│
├── infrastructure/       # 🔧 External Services
│   ├── repositories/     # Repository implementations
│   ├── datasources/      # Database implementations
│   └── services/        # External service integrations
│
├── data/                # 💾 Database Layer
│   ├── mongo/           # MongoDB configuration
│   └── mysql/           # MySQL configuration
│
└── config/              # ⚙️ Configuration
    └── plugins/         # Environment configuration
```

### 🎯 Principios de Diseño

- **Dependency Inversion**: Las dependencias apuntan hacia el dominio
- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **Open/Closed**: Abierto para extensión, cerrado para modificación
- **Interface Segregation**: Interfaces específicas y cohesivas
- **SOLID Principles**: Aplicación completa de principios SOLID

---

## 🚀 Características

### 🔄 Funcionalidades ~~Actuales~~ actuales y futuras

#### 👥 Gestión Completa de Pacientes
- **CRUD Completo**: Crear, leer, actualizar y eliminar pacientes
- **Validación Robusta**: DTOs con validación exhaustiva de datos
- **Búsqueda Avanzada**: Por DNI, nombre, email con filtros múltiples
- **Datos Médicos**: Información personal y médica completa

#### 🏥 Entidades del Dominio
- **Patient Entity**: Entidad principal con información médica completa
- **Doctor Interface**: Preparado para especialidades médicas
- **Medical Records**: Base para historiales médicos
- **Prescription System**: Preparado para recetas digitales

#### 🛡️ Seguridad y Validación
- **Custom Error Handling**: Manejo profesional de errores
- **DTO Pattern**: Validación de datos en capas apropiadas
- **Entity ID Validation**: Validación especializada de identificadores
- **API Response Envelope**: Respuestas consistentes y profesionales

### 🚧 En Desarrollo

#### 📅 Sistema de Citas
- Gestión de horarios médicos
- Reservas con validación de disponibilidad
- Notificaciones automáticas
- Reagendamiento y cancelaciones

#### 👨‍⚕️ Gestión de Doctores
- Perfiles médicos completos
- Especialidades y certificaciones
- Horarios de trabajo
- Métricas de performance

#### 💰 Sistema de Facturación
- Facturación automática
- Integración con obras sociales
- Procesamiento de pagos
- Reportes financieros

---

## 🛠️ Stack Tecnológico

### 🖥️ Backend Core
- **Node.js** - Runtime de JavaScript
- **TypeScript 5.8.3** - Tipado estático
- **Express 5.1.0** - Framework web
- **Clean Architecture** - Patrón arquitectónico

### 🗄️ Base de Datos
- **MySQL** - Base de datos relacional (transacciones)

### 🧪 Testing
- **Jest** - Framework de testing

### 🔧 Configuración
- **env-var** - Gestión de variables de entorno
- **dotenv** - Carga de archivos .env
- **ts-node-dev** - Desarrollo con hot reload

---


## 🔒 Seguridad

### 🛡️ Medidas de Seguridad Proyectadas

#### Input Validation
- **DTO Pattern**: Validación en capas apropiadas
- **Type Safety**: TypeScript para prevención de errores
- **Sanitization**: Limpieza de datos de entrada
- **Schema Validation**: Validación de esquemas JSON

#### Error Handling
- **Custom Error Classes**: Manejo profesional de errores
- **Error Boundaries**: Captura centralizada de errores
- **Logging Seguro**: No exposición de datos sensibles
- **Stack Trace Protection**: Ocultación en producción

### 🔐 Futuras Implementaciones

- **JWT Authentication**: Autenticación con tokens
- **Role-Based Access Control**: Permisos granulares
- **Multi-Factor Authentication**: 2FA para personal médico
- **API Rate Limiting**: Protección contra ataques
- **SQL Injection Prevention**: Queries parametrizadas
- **XSS Protection**: Sanitización de contenido

---


### 🚀 Futuras Optimizaciones

- **Redis Caching**: Cache en memoria para datos frecuentes
- **Database Sharding**: Particionamiento horizontal
- **CDN Integration**: Distribución de contenido
- **Load Balancing**: Distribución de carga
- **Microservices**: Escalado independiente por servicio

---




## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Nath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

