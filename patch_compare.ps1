$content = [System.IO.File]::ReadAllText("components/sections/CompareSection.tsx", [System.Text.Encoding]::UTF8)

# Replace imports and custom icons (lines 7 to 205)
$startCustomIcons = $content.IndexOf("// ─── PREMIUM CUSTOM SVG ICONS ──────────────────────────────────────────────────")
$endCustomIcons = $content.IndexOf("const rows = [")

if ($startCustomIcons -ge 0 -and $endCustomIcons -gt $startCustomIcons) {
    $before = $content.Substring(0, $startCustomIcons)
    $after = $content.Substring($endCustomIcons)
    
    $imports = @"
import {
  FeatureMoney,
  FeatureLiveTV,
  Feature4K,
  FeatureMovies,
  FeatureSports,
  FeatureGlobe,
  FeatureFile,
  FeatureDevices,
  FeatureLightning,
  FeatureSupport,
  FeatureNoLock
} from "@/components/ui/icons";

"@
    $content = $before + $imports + $after
} else {
    Write-Error "Failed to find custom icons boundary"
}

# Replace rows definition
$startRows = $content.IndexOf("const rows = [")
$endRows = $content.IndexOf("// ─── CHECKMARK / RED X BADGES")

if ($startRows -ge 0 -and $endRows -gt $startRows) {
    $before = $content.Substring(0, $startRows)
    $after = $content.Substring($endRows)
    
    $newRows = @"
const rows = [
  {
    icon: <FeatureMoney size="sm" />,
    feature: "Monthly Cost",
    streamb4: "From $15/month",
    cable: "`$100-`$150+/month",
  },
  {
    icon: <FeatureLiveTV size="sm" />,
    feature: "Live Channels",
    streamb4: "50,000+ channels",
    cable: "200-500 channels",
  },
  {
    icon: <Feature4K size="sm" />,
    feature: "4K Ultra HD",
    streamb4: "Included - free",
    cable: "Extra monthly charge",
  },
  {
    icon: <FeatureMovies size="sm" />,
    feature: "VOD Library",
    streamb4: "180,000+ titles",
    cable: "Very limited",
  },
  {
    icon: <FeatureSports size="sm" />,
    feature: "Sports Channels",
    streamb4: "1,800+ channels",
    cable: "Basic packages only",
  },
  {
    icon: <FeatureGlobe size="sm" />,
    feature: "International",
    streamb4: "60+ countries",
    cable: "Very limited",
  },
  {
    icon: <FeatureFile size="sm" />,
    feature: "Contracts",
    streamb4: "No contracts - ever",
    cable: "12-24 month lock-in",
  },
  {
    icon: <FeatureDevices size="sm" />,
    feature: "Device Support",
    streamb4: "All devices - free",
    cable: "Limited + extra fees",
  },
  {
    icon: <FeatureLightning size="sm" />,
    feature: "Activation",
    streamb4: "Instant - 60 seconds",
    cable: "Technician visit needed",
  },
  {
    icon: <FeatureSupport size="sm" />,
    feature: "24/7 Support",
    streamb4: "Real humans - always",
    cable: "Call center queues",
  },
  {
    icon: <FeatureNoLock size="sm" />,
    feature: "Works Abroad",
    streamb4: "No IP lock - anywhere",
    cable: "Region locked",
  },
];

"@
    $content = $before + $newRows + $after
} else {
    Write-Error "Failed to find rows definition boundary"
}

# Replace the icon rendering wrapper
$oldWrapper = @"
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,138,0,0.3)]"
          style={{
            background: "linear-gradient(135deg, rgba(255,138,0,0.1), rgba(255,179,0,0.05))",
            border: "1px solid rgba(255,138,0,0.18)",
          }}
        >
          {row.icon}
        </div>
"@

$newWrapper = @"
        {row.icon}
"@

if ($content.Contains($oldWrapper)) {
    $content = $content.Replace($oldWrapper, $newWrapper)
} else {
    Write-Error "Failed to find old icon wrapper in CompareSection.tsx"
}

[System.IO.File]::WriteAllText("components/sections/CompareSection.tsx", $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully patched CompareSection.tsx"
