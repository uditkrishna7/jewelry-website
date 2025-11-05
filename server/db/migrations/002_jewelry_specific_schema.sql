-- Enhance products table with jewelry-specific fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS material VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS gemstone VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS purity VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection_name VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS customizable BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS size_options TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    banner_image TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    customer_id INTEGER REFERENCES customers(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, product_id)
);

-- Create custom_orders table
CREATE TABLE IF NOT EXISTS custom_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    specifications TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    estimated_completion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gift_wrapping table
CREATE TABLE IF NOT EXISTS gift_wrapping (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    message TEXT,
    wrap_type VARCHAR(50),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add gift wrapping reference to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_wrap_id INTEGER REFERENCES gift_wrapping(id);

-- Create certificates table for jewelry authentication
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    certificate_number VARCHAR(100) UNIQUE,
    issuer VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS maintenance_records (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    service_type VARCHAR(100),
    description TEXT,
    status VARCHAR(50),
    estimated_completion DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_name);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_customer ON wishlists(customer_id);

-- Create trigger for certificate validation
CREATE OR REPLACE FUNCTION validate_certificate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= NEW.issue_date THEN
        RAISE EXCEPTION 'Certificate expiry date must be after issue date';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certificate_validation
    BEFORE INSERT OR UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION validate_certificate();

-- Add sample collections
INSERT INTO collections (name, description) VALUES
('Wedding Collection', 'Elegant pieces for your special day'),
('Vintage Collection', 'Timeless classics with a modern twist'),
('Summer Collection', 'Light and vibrant pieces for the season')
ON CONFLICT DO NOTHING;