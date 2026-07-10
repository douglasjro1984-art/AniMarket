-- ============================================
-- AniMarket - Esquema de base de datos
-- Ejecutar en MySQL Workbench
-- ============================================

CREATE DATABASE IF NOT EXISTS amarket_db;
USE amarket_db;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  categoria VARCHAR(100),
  imagenes JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de ordenes
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL UNIQUE,
  items JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  entrega ENUM('domicilio', 'sucursal') NOT NULL,
  direccion TEXT,
  pago ENUM('tarjeta', 'transferencia', 'efectivo') NOT NULL,
  estado ENUM('pendiente', 'observacion', 'entregado') DEFAULT 'pendiente',
  fecha VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de datos bancarios
CREATE TABLE IF NOT EXISTS bank_data (
  id INT PRIMARY KEY DEFAULT 1,
  nombre VARCHAR(255),
  telefono VARCHAR(50),
  numero VARCHAR(100),
  cbu VARCHAR(100),
  alias VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos bancarios vacios por defecto
INSERT INTO bank_data (id, nombre, telefono, numero, cbu, alias)
VALUES (1, '', '', '', '', '')
ON DUPLICATE KEY UPDATE id=id;
