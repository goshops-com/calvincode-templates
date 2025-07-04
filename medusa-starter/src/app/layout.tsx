import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import Script from "next/script"
import { DevInspector } from "@lib/components/DevInspector"
import { InspectModeIndicator } from "@lib/components/InspectModeIndicator"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        {/* <Script src="https://public-assets.goshops.ai/select.js" /> */}
      </head>
      <body>
        <DevInspector />
        <InspectModeIndicator />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
