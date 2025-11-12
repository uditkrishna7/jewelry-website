#!/usr/bin/env pwsh
# Comprehensive test suite for jewelry website

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "JEWELRY WEBSITE - COMPREHENSIVE FEATURE TEST" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$testResults = @()

# Test function
function Test-Feature {
    param(
        [string]$featureName,
        [scriptblock]$testScript
    )
    
    try {
        Write-Host "Testing: $featureName..." -ForegroundColor Yellow -NoNewline
        $result = & $testScript
        if ($result) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            $testResults += @{ Name = $featureName; Status = "PASS" }
        } else {
            Write-Host " ❌ FAIL" -ForegroundColor Red
            $testResults += @{ Name = $featureName; Status = "FAIL" }
        }
    } catch {
        Write-Host " ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += @{ Name = $featureName; Status = "ERROR" }
    }
}

# Test 1: Home page loads
Test-Feature "Home page loads" {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -ErrorAction Stop
        $response.StatusCode -eq 200
    } catch {
        $false
    }
}

# Test 2: Admin page loads  
Test-Feature "Admin dashboard loads" {
    $response = curl -s "$baseUrl/admin/index.html" -UseBasicParsing
    $response.Length -gt 0
}

# Test 3: Products API
Test-Feature "GET /api/products" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Get -ErrorAction Stop
    $response -is [array] -and $response.Count -gt 0
}

# Test 4: Single product API
Test-Feature "GET /api/products/101" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products/101" -Method Get -ErrorAction Stop
    $response.id -eq 101
}

# Test 5: Create product
Test-Feature "POST /api/products (create)" {
    $product = @{
        name = "Test Ring"
        price = 99.99
        description = "Test product"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products" -Method Post -ContentType "application/json" -Body $product -ErrorAction Stop
    $response.id -gt 0
}

# Test 6: Get customers
Test-Feature "GET /api/customers" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/customers" -Method Get -ErrorAction Stop
    $response -is [array]
}

# Test 7: Create customer
Test-Feature "POST /api/customers (create)" {
    $customer = @{
        name = "Test Customer"
        email = "test$(Get-Random)@example.com"
        phone = "555-1234"
        status = "active"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/customers" -Method Post -ContentType "application/json" -Body $customer -ErrorAction Stop
    $response.id -gt 0
}

# Test 8: Newsletter subscribe
Test-Feature "POST /api/newsletter/subscribe" {
    $email = @{
        email = "newsletter$(Get-Random)@example.com"
        name = "Test Subscriber"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/newsletter/subscribe" -Method Post -ContentType "application/json" -Body $email -ErrorAction Stop
    $response.id -gt 0 -or $response.success -eq $true
}

# Test 9: Get newsletter subscribers
Test-Feature "GET /api/newsletter/subscribers" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/newsletter/subscribers" -Method Get -ErrorAction Stop
    $response -is [array] -and $response.Count -gt 0
}

# Test 10: Send newsletter
Test-Feature "POST /api/newsletter/send" {
    $newsletter = @{
        subject = "Test Newsletter"
        content = "This is a test newsletter"
        test_send = $true
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/newsletter/send" -Method Post -ContentType "application/json" -Body $newsletter -ErrorAction Stop
    $response.success -eq $true -or $response.message -like "*sent*"
}

# Test 11: Cart page loads
Test-Feature "Cart page loads" {
    $response = curl -s "$baseUrl/cart.html" -UseBasicParsing
    $response.Length -gt 0 -and $response -match "cart"
}

# Test 12: Products page loads
Test-Feature "Products page loads" {
    $response = curl -s "$baseUrl/product.html" -UseBasicParsing
    $response.Length -gt 0
}

# Test 13: Admin customers page loads
Test-Feature "Admin customers page loads" {
    $response = curl -s "$baseUrl/admin/customers.html" -UseBasicParsing
    $response.Length -gt 0
}

# Test 14: Admin products page loads
Test-Feature "Admin products page loads" {
    $response = curl -s "$baseUrl/admin/products.html" -UseBasicParsing
    $response.Length -gt 0
}

# Test 15: Update customer
Test-Feature "PUT /api/customers/1 (update)" {
    $update = @{
        name = "Updated Customer"
        email = "updated@example.com"
        phone = "555-9999"
        status = "active"
        notes = "Updated notes"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/customers/1" -Method Put -ContentType "application/json" -Body $update -ErrorAction Stop
    $response.id -eq 1 -or $response.name -eq "Updated Customer"
}

# Test 16: Update product
Test-Feature "PUT /api/products/101 (update)" {
    $update = @{
        name = "Updated Ring"
        price = 89.99
        description = "Updated description"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products/101" -Method Put -ContentType "application/json" -Body $update -ErrorAction Stop
    $response.id -eq 101 -or $response.name -eq "Updated Ring"
}

# Test 17: Static CSS loads
Test-Feature "Main CSS loads" {
    $response = curl -s "$baseUrl/css/styles.css" -UseBasicParsing
    $response.Length -gt 100
}

# Test 18: Admin CSS loads
Test-Feature "Admin CSS loads" {
    $response = curl -s "$baseUrl/admin/css/admin.css" -UseBasicParsing
    $response.Length -gt 100
}

# Test 19: Main JS loads
Test-Feature "Main JS loads" {
    $response = curl -s "$baseUrl/js/main.js" -UseBasicParsing
    $response.Length -gt 100
}

# Test 20: Admin JS loads
Test-Feature "Admin JS loads" {
    $response = curl -s "$baseUrl/admin/js/admin.js" -UseBasicParsing
    $response.Length -gt 100
}

# Summary
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$errors = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor Cyan
Write-Host "✅ Passed:  $passed" -ForegroundColor Green
Write-Host "❌ Failed:  $failed" -ForegroundColor Red
Write-Host "⚠️  Errors:  $errors" -ForegroundColor Yellow
Write-Host ""

if ($failed -gt 0 -or $errors -gt 0) {
    Write-Host "Failed/Error Tests:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -ne "PASS" } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Status)" -ForegroundColor Red
    }
}

$passPercentage = [math]::Round(($passed / $total) * 100, 2)
Write-Host ""
Write-Host "Pass Rate: $passPercentage%" -ForegroundColor Cyan
Write-Host ""

if ($passed -eq $total) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
}

