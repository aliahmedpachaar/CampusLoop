const sharp = require('sharp');
const path = require('path');
const primaryColor = '#0D9488';
const bgColor = '#FFFFFF';
async function createIcon(size, filename) {
    const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        <g transform="translate(${size * 0.1}, ${size * 0.1})">
            <path
                d="M${size * 0.4} ${size * 0.064}
                   C${size * 0.2} ${size * 0.064} ${size * 0.064} ${size * 0.224} ${size * 0.064} ${size * 0.4}
                   C${size * 0.064} ${size * 0.576} ${size * 0.2} ${size * 0.736} ${size * 0.4} ${size * 0.736}
                   C${size * 0.496} ${size * 0.736} ${size * 0.584} ${size * 0.696} ${size * 0.64} ${size * 0.624}
                   L${size * 0.568} ${size * 0.552}
                   C${size * 0.528} ${size * 0.608} ${size * 0.464} ${size * 0.64} ${size * 0.4} ${size * 0.64}
const sharp = require('sharp');
const path = require('path' 0const path = require('path');
0.const primaryColor = '#0D948  const bgColor = '#FFFFFF';
asy* async function createIconsi    const svg = `
    <svg width="${size        <svg width="${        <rect width="${size}" height="${size}" fill="${bgColor}"/>
        < $        <g transform="translate(${size * 0.1}, ${size * 0.1})">
 
             <path
                d="M${size * 0.4} ${size *0.49                4}                   C${size * 0.2} ${size * 0.064 f                   C${size * 0.064} ${size * 0.576} ${size * 0.2} ${size * 0.736} ${size * 0.4} ${size * 0.736)
                   C${size * 0.496} ${size * 0.736} ${size * 0.584} ${size * 0.696} ${size * 0.64} ${size * 0.ti                   L${size * 0.568} ${size * 0.552}
                   C${size * 0.528} ${size * 0.608} ${size * he                   C${size * 0.528} ${size * 0.608">const sharp = require('sharp');
const path = require('path' 0const path = require('path');
0.const primaryCext-aconst path = require('path' 0cnt0.const primaryColor = '#0D948  const bgColor = '#FFFFFF'boasy* async function createIconsi    const svg = `
    <sv.f    <svg width="${size        <svg width="${    in        < $        <g transform="translate(${size * 0.1}, ${size * 0.1})">
 
             <path
             ry 
             <path
                d="M${size * 0.4} ${size *0.49      024,                dng                   C${size * 0.496} ${size * 0.736} ${size * 0.584} ${size * 0.696} ${size * 0.64} ${size * 0.ti                   L${si    } catch (err) {
        console.error('Error:', err);
    }
}
main();
