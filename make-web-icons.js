import fs from 'fs'
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'
import { join, basename, extname } from 'path'
import chalk from 'chalk'

const outputDirectory = './dist'

const createDistributionPartial = (outputPath, iconName) => async fileName => {
    const fullPath = `${outputPath}/${iconName}`

    try {
        await mkdir(fullPath, { recursive: true })
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err
        }
    }
    return join(fullPath, fileName)
}

const generateIcons = async (inputPath, outputPath) => {
    let icon
    const iconName = basename(inputPath, extname(inputPath))

    try {
        const createDistribution = createDistributionPartial(outputPath, iconName)
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
        icon = 'favicon.ico'
        await sharp(squareSvgBuffer)
            .resize({ width: 32, height: 32 })
            .toFile(await createDistribution(icon))
        console.info('\n-', chalk.yellow(`Created ./${join(outputPath, iconName, icon)}`))

        // Generate icon.svg
        icon = 'icon.svg'
        fs.copyFileSync(inputPath, await createDistribution(icon))
        console.info('-', chalk.yellow(`Created ./${join(outputPath, iconName, icon)}`))

        // Generate apple-touch-icon.png (180x180)
        icon = 'apple-touch-icon.png'
        await sharp(squareSvgBuffer)
            .resize({ width: 180, height: 180 })
            .toFile(await createDistribution(icon))
        console.info('-', chalk.yellow(`Created ./${join(outputPath, iconName, icon)}`))

        // Generate icon-192.png (192x192)
        icon = 'icon-192.png'
        await sharp(squareSvgBuffer)
            .resize({ width: 192, height: 192 })
            .toFile(await createDistribution(icon))
        console.info('-', chalk.yellow(`Created ./${join(outputPath, iconName, icon)}`))

        // Generate icon-512.png (512x512)
        icon = 'icon-512.png'
        await sharp(squareSvgBuffer)
            .resize({ width: 512, height: 512 })
            .toFile(await createDistribution(icon))
        console.info('-', chalk.yellow(`Created ./${join(outputPath, iconName, icon)}`))

        console.info(chalk.greenBright('\nIcons generated successfully.\n'))
    } catch (err) {
        console.error('Error generating icons:', err)
    }
}

const inputSVGPath = process.argv[2]

generateIcons(inputSVGPath, outputDirectory)
