Add-Type -AssemblyName System.Drawing

function Draw-SarmayadarLogo {
    param(
        [int]$width = 512,
        [int]$height = 512,
        [string]$outputPath,
        [bool]$isDarkBg = $false,
        [bool]$includeBg = $false
    )

    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.Clear([System.Drawing.Color]::Transparent)

    if ($includeBg) {
        if ($isDarkBg) {
            $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 6, 78, 59)) # #064E3B
        } else {
            $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        }
        $gfx.FillRectangle($bgBrush, 0, 0, $width, $height)
        $bgBrush.Dispose()
    }

    # Scaling factors (from 100x100 reference space to target width/height with 10% padding)
    $padding = $width * 0.08
    $drawSize = $width - ($padding * 2)
    $scale = $drawSize / 100.0

    function Scale-Pt([float]$x, [float]$y) {
        return New-Object System.Drawing.PointF ($padding + ($x * $scale)), ($padding + ($y * $scale))
    }

    # Colors
    if ($isDarkBg) {
        $roofColor = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
        $leftColor = [System.Drawing.Color]::FromArgb(255, 16, 185, 129) # #10B981
        $rightColor = [System.Drawing.Color]::FromArgb(255, 52, 211, 153) # #34D399
        $windowColor = [System.Drawing.Color]::FromArgb(255, 245, 158, 11) # #F59E0B
    } else {
        $roofColor = [System.Drawing.Color]::FromArgb(255, 8, 56, 24) # #083818
        $leftColor = [System.Drawing.Color]::FromArgb(255, 8, 56, 24) # #083818
        $rightColor = [System.Drawing.Color]::FromArgb(255, 0, 138, 60) # #008A3C
        $windowColor = [System.Drawing.Color]::FromArgb(255, 245, 158, 11) # #F59E0B
    }

    # 1. House Roof / Frame
    $roofPen = New-Object System.Drawing.Pen $roofColor, (6.5 * $scale)
    $roofPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Square
    $roofPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Square
    $roofPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter

    $pts = @(
        (Scale-Pt 13 85),
        (Scale-Pt 13 37),
        (Scale-Pt 50 11),
        (Scale-Pt 87 37),
        (Scale-Pt 87 85)
    )
    $gfx.DrawLines($roofPen, $pts)
    $roofPen.Dispose()

    # 2. Golden Window (4 panes)
    $winBrush = New-Object System.Drawing.SolidBrush $windowColor
    $wSize = 5.6 * $scale
    $wGap = 2.4 * $scale
    $wCenterX = $padding + (50 * $scale)
    $wTopY = $padding + (22.5 * $scale)

    $wx1 = $wCenterX - $wSize - ($wGap / 2)
    $wx2 = $wCenterX + ($wGap / 2)
    $wy1 = $wTopY
    $wy2 = $wTopY + $wSize + $wGap

    $gfx.FillRectangle($winBrush, $wx1, $wy1, $wSize, $wSize)
    $gfx.FillRectangle($winBrush, $wx2, $wy1, $wSize, $wSize)
    $gfx.FillRectangle($winBrush, $wx1, $wy2, $wSize, $wSize)
    $gfx.FillRectangle($winBrush, $wx2, $wy2, $wSize, $wSize)
    $winBrush.Dispose()

    # 3. Left Pillar (Dark Green)
    $leftBrush = New-Object System.Drawing.SolidBrush $leftColor
    $leftPoly = @(
        (Scale-Pt 22 49),
        (Scale-Pt 45 62.5),
        (Scale-Pt 45 80),
        (Scale-Pt 22 93.5)
    )
    $gfx.FillPolygon($leftBrush, $leftPoly)
    $leftBrush.Dispose()

    # 4. Right Pillar (Emerald Green)
    $rightBrush = New-Object System.Drawing.SolidBrush $rightColor
    $rightPoly = @(
        (Scale-Pt 55 62.5),
        (Scale-Pt 78 49),
        (Scale-Pt 78 93.5),
        (Scale-Pt 55 80)
    )
    $gfx.FillPolygon($rightBrush, $rightPoly)
    $rightBrush.Dispose()

    $gfx.Dispose()
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Generated: $outputPath"
}

# Ensure directories exist
New-Item -ItemType Directory -Force -Path "css" | Out-Null
New-Item -ItemType Directory -Force -Path "src\assets" | Out-Null

Draw-SarmayadarLogo -width 512 -height 512 -outputPath "css\favicon.png" -includeBg $true -isDarkBg $false
Draw-SarmayadarLogo -width 192 -height 192 -outputPath "css\icon-192.png" -includeBg $true -isDarkBg $false
Draw-SarmayadarLogo -width 512 -height 512 -outputPath "css\icon-512.png" -includeBg $true -isDarkBg $false
Draw-SarmayadarLogo -width 180 -height 180 -outputPath "css\apple-touch-icon.png" -includeBg $true -isDarkBg $false
Draw-SarmayadarLogo -width 64 -height 64 -outputPath "favicon.png" -includeBg $true -isDarkBg $false
