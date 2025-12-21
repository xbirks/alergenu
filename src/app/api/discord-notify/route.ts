import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { type, metadata = {} } = await request.json();

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('DISCORD_WEBHOOK_URL not configured');
            return NextResponse.json({ success: false }, { status: 500 });
        }

        // Get user metadata
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';

        // Build Discord message based on type
        let embed;

        switch (type) {
            case 'cta_generic':
                embed = {
                    title: '🎯 Nuevo clic en CTA',
                    description: 'Usuario hizo clic en **"Prueba 3 meses gratis"**',
                    color: 3447003, // Blue
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `IP: ${ip.split(',')[0]}`
                    }
                };
                break;

            case 'cta_autonomia':
                embed = {
                    title: '💼 Interés en Plan Autonomía',
                    description: 'Usuario hizo clic en el **Plan Autonomía**',
                    color: 15844367, // Gold
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `IP: ${ip.split(',')[0]}`
                    }
                };
                break;

            case 'cta_premium':
                embed = {
                    title: '⭐ Interés en Plan Premium',
                    description: 'Usuario hizo clic en el **Plan Premium**',
                    color: 10181046, // Purple
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `IP: ${ip.split(',')[0]}`
                    }
                };
                break;

            case 'registration':
                embed = {
                    title: '🎉 Nuevo registro',
                    description: `**Email:** ${metadata.email || 'No disponible'}`,
                    color: 3066993, // Green
                    timestamp: new Date().toISOString(),
                    fields: [
                        {
                            name: 'Nombre',
                            value: metadata.displayName || 'No proporcionado',
                            inline: true
                        }
                    ],
                    footer: {
                        text: `IP: ${ip.split(',')[0]}`
                    }
                };
                break;

            default:
                embed = {
                    title: '📊 Evento desconocido',
                    description: `Tipo: ${type}`,
                    color: 9807270, // Gray
                    timestamp: new Date().toISOString()
                };
        }

        // Send to Discord
        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        if (!discordResponse.ok) {
            console.error('Discord webhook failed:', await discordResponse.text());
            return NextResponse.json({ success: false }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error sending Discord notification:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
