import fs from 'fs'
import sharp from 'sharp'

const generateIcons = async (inputPath, outputPath) => {
    try {
        const svgBuffer = fs.readFileSync(inputPath)

        if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true })

        const { width, height } = await sharp(svgBuffer).metadata()
        const size = Math.max(width, height)
        const squareSvgBuffer = await sharp(svgBuffer)
            .resize({
                width: size,
                height: size,
                fit: 'contain',
                background:
                {
                    r: 255,
                    g: 255,
                    b: 255,
                    alpha: 0
                }
            })
            .toBuffer()

        // Generate favicon.ico (32x32)
        await sharp(squareSvgBuffer)
            .resize({ width: 32, height: 32 })
            .toFile(`${outputPath}/favicon.ico`)

        // Generate icon.svg
        fs.copyFileSync(inputPath, `${outputPath}/icon.svg`)

        // Generate apple-touch-icon.png (180x180)
        await sharp(squareSvgBuffer)
            .resize({ width: 180, height: 180 })
            .toFile(`${outputPath}/apple-touch-icon.png`)

        // Generate icon-192.png (192x192)
        await sharp(squareSvgBuffer)
            .resize({ width: 192, height: 192 })
            .toFile(`${outputPath}/icon-192.png`)

        // Generate icon-512.png (512x512)
        await sharp(squareSvgBuffer)
            .resize({ width: 512, height: 512 })
            .toFile(`${outputPath}/icon-512.png`)

        console.info('Icons generated successfully.')
    } catch (err) {
        console.error('Error generating icons:', err)
    }
}

const inputSVGPath = process.argv[2]
const outputDirectory = process.argv[3]

generateIcons(inputSVGPath, outputDirectory)
