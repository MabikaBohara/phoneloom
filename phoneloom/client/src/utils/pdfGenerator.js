import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Customer Invoice PDF - Professional format for customers
export const generateCustomerInvoicePDF = (order) => {
    const doc = new jsPDF();
    
    // Add Receipt at the top
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('RECEIPT', 105, 15, { align: 'center' });
    
    // Add company name
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('PhoneLoom', 105, 25, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Order Invoice', 105, 33, { align: 'center' });
    
    // Add order info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Order ID: ${order._id}`, 20, 45);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 51);
    doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, 57);
    
    // Add shipping address
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text('Shipping Address', 20, 70);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${order.shippingAddress.address}`, 20, 77);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 20, 83);
    doc.text(`${order.shippingAddress.country}`, 20, 89);
    
    // Add order items table
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text('Order Items', 20, 102);
    
    const tableData = order.orderItems.map(item => {
        const productName = item.phone?.model || item.phone?.name || 'N/A';
        const options = [
            item.selectedColor ? `Color: ${item.selectedColor}` : '',
            item.selectedStorage ? `Storage: ${item.selectedStorage}` : '',
            item.selectedRam ? `RAM: ${item.selectedRam}` : ''
        ].filter(Boolean).join(', ');
        
        return [
            productName,
            options || 'N/A',
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ];
    });
    
    autoTable(doc, {
        startY: 107,
        head: [['Product', 'Options', 'Qty', 'Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 }
    });
    
    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY || 128;
    
    // Add order summary
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text('Order Summary', 20, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const summaryY = finalY + 22;
    doc.text(`Subtotal:`, 130, summaryY);
    doc.text(`$${order.itemsPrice.toFixed(2)}`, 170, summaryY, { align: 'right' });
    
    doc.text(`Shipping:`, 130, summaryY + 6);
    doc.text(`$${order.shippingPrice.toFixed(2)}`, 170, summaryY + 6, { align: 'right' });
    
    doc.text(`Tax:`, 130, summaryY + 12);
    doc.text(`$${order.taxPrice.toFixed(2)}`, 170, summaryY + 12, { align: 'right' });
    
    // Add total with bold
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Total:`, 130, summaryY + 20);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 170, summaryY + 20, { align: 'right' });
    
    // Add payment info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, summaryY + 20);
    doc.text(`Payment Status: ${order.isPaid ? 'Paid' : 'Not Paid'}`, 20, summaryY + 26);
    if (order.paidAt) {
        doc.text(`Paid At: ${new Date(order.paidAt).toLocaleString()}`, 20, summaryY + 32);
    }
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Thank you for your purchase!', 105, 280, { align: 'center' });
    doc.text('PhoneLoom - Your trusted phone store', 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`Invoice_${order._id}.pdf`);
};

// Admin Order Details PDF - Comprehensive format for admin
export const generateAdminOrderPDF = (order) => {
    const doc = new jsPDF();
    
    // Header - Admin Order Document
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('ORDER DETAILS', 105, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('PhoneLoom - Admin Document', 105, 25, { align: 'center' });
    
    // Order ID Badge
    doc.setFontSize(10);
    doc.text(`Document Generated: ${new Date().toLocaleString()}`, 105, 32, { align: 'center' });
    
    // Reset colors
    doc.setTextColor(40);
    
    // Order Information Section
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('ORDER INFORMATION', 20, 45);
    doc.setDrawColor(59, 130, 246);
    doc.line(20, 47, 190, 47);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Order ID:`, 20, 55);
    doc.setTextColor(40);
    doc.text(order._id, 60, 55);
    
    doc.setTextColor(60);
    doc.text(`Order Date:`, 20, 62);
    doc.setTextColor(40);
    doc.text(new Date(order.createdAt).toLocaleString(), 60, 62);
    
    doc.setTextColor(60);
    doc.text(`Current Status:`, 20, 69);
    
    const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    
    // Set color based on status
    if (order.status === 'delivered') {
        doc.setTextColor(34, 197, 94); // Green
    } else if (order.status === 'shipped') {
        doc.setTextColor(59, 130, 246); // Blue
    } else if (order.status === 'cancelled') {
        doc.setTextColor(239, 68, 68); // Red
    } else {
        doc.setTextColor(251, 191, 36); // Yellow/Orange
    }
    
    doc.text(statusText, 60, 69);
    
    // Customer Information Section
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('CUSTOMER INFORMATION', 20, 82);
    doc.line(20, 84, 190, 84);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    if (order.user) {
        doc.text(`Customer Name:`, 20, 92);
        doc.setTextColor(40);
        doc.text(order.user.name, 60, 92);
        
        doc.setTextColor(60);
        doc.text(`Email:`, 20, 99);
        doc.setTextColor(40);
        doc.text(order.user.email, 60, 99);
        
        doc.setTextColor(60);
        doc.text(`Customer ID:`, 20, 106);
        doc.setTextColor(40);
        doc.text(order.user._id || order.user, 60, 106);
    }
    
    // Shipping Details Section
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('SHIPPING DETAILS', 20, 119);
    doc.line(20, 121, 190, 121);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Address:`, 20, 129);
    doc.setTextColor(40);
    doc.text(order.shippingAddress.address, 60, 129);
    
    doc.setTextColor(60);
    doc.text(`City:`, 20, 136);
    doc.setTextColor(40);
    doc.text(order.shippingAddress.city, 60, 136);
    
    doc.setTextColor(60);
    doc.text(`Postal Code:`, 20, 143);
    doc.setTextColor(40);
    doc.text(order.shippingAddress.postalCode, 60, 143);
    
    doc.setTextColor(60);
    doc.text(`Country:`, 20, 150);
    doc.setTextColor(40);
    doc.text(order.shippingAddress.country, 60, 150);
    
    // Order Items Table
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('ORDER ITEMS', 20, 163);
    doc.line(20, 165, 190, 165);
    
    const tableData = order.orderItems.map(item => {
        const productName = item.phone?.model || item.phone?.name || 'N/A';
        const specs = [
            item.selectedColor ? `Color: ${item.selectedColor}` : '',
            item.selectedStorage ? `Storage: ${item.selectedStorage}` : '',
            item.selectedRam ? `RAM: ${item.selectedRam}` : ''
        ].filter(Boolean).join('\n');
        
        return [
            productName,
            specs || 'Default',
            item.quantity.toString(),
            `$${item.price.toFixed(2)}`,
            `$${(item.price * item.quantity).toFixed(2)}`
        ];
    });
    
    autoTable(doc, {
        startY: 170,
        head: [['Product', 'Specifications', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
            fillColor: [59, 130, 246],
            fontSize: 10,
            fontStyle: 'bold'
        },
        styles: { 
            fontSize: 9,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 60 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
        }
    });
    
    const finalY = doc.lastAutoTable.finalY || 170;
    
    // Financial Summary
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('FINANCIAL SUMMARY', 20, finalY + 12);
    doc.line(20, finalY + 14, 190, finalY + 14);
    
    const summaryY = finalY + 22;
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    doc.text('Items Subtotal:', 120, summaryY);
    doc.setTextColor(40);
    doc.text(`$${order.itemsPrice.toFixed(2)}`, 180, summaryY, { align: 'right' });
    
    doc.setTextColor(60);
    doc.text('Shipping Fee:', 120, summaryY + 7);
    doc.setTextColor(40);
    doc.text(`$${order.shippingPrice.toFixed(2)}`, 180, summaryY + 7, { align: 'right' });
    
    doc.setTextColor(60);
    doc.text('Tax (13%):', 120, summaryY + 14);
    doc.setTextColor(40);
    doc.text(`$${order.taxPrice.toFixed(2)}`, 180, summaryY + 14, { align: 'right' });
    
    // Total with background
    doc.setFillColor(59, 130, 246);
    doc.rect(115, summaryY + 20, 75, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('GRAND TOTAL:', 120, summaryY + 27);
    doc.text(`$${order.totalPrice.toFixed(2)}`, 180, summaryY + 27, { align: 'right' });
    
    // Payment Information
    doc.setFontSize(14);
    doc.setTextColor(59, 130, 246);
    doc.text('PAYMENT INFORMATION', 20, summaryY + 43);
    doc.line(20, summaryY + 45, 190, summaryY + 45);
    
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text('Payment Method:', 20, summaryY + 53);
    doc.setTextColor(40);
    doc.text(order.paymentMethod, 70, summaryY + 53);
    
    doc.setTextColor(60);
    doc.text('Payment Status:', 20, summaryY + 60);
    
    // Set color based on payment status
    if (order.isPaid) {
        doc.setTextColor(34, 197, 94); // Green for paid
    } else {
        doc.setTextColor(239, 68, 68); // Red for not paid
    }
    
    doc.text(order.isPaid ? 'PAID ✓' : 'NOT PAID ✗', 70, summaryY + 60);
    
    if (order.paidAt) {
        doc.setTextColor(60);
        doc.text('Payment Date:', 20, summaryY + 67);
        doc.setTextColor(40);
        doc.text(new Date(order.paidAt).toLocaleString(), 70, summaryY + 67);
    }
    
    // Footer
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('This is an administrative document - For internal use only', 105, 287, { align: 'center' });
    doc.text('PhoneLoom Admin Panel - Confidential', 105, 292, { align: 'center' });
    
    // Save the PDF
    doc.save(`AdminOrder_${order._id}.pdf`);
};

// Legacy function for backward compatibility
export const generateOrderPDF = generateCustomerInvoicePDF;
