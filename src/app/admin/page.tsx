
// src/app/admin/page.tsx
import { getAdminDb } from '@/lib/firebase/firebase-admin';
import { getAuthenticatedAppForUser } from '@/lib/firebase/firebase-auth';
import { redirect } from 'next/navigation';
import ImpersonationButton from './ImpersonationButton';

type Restaurant = {
    id: string;
    name: string;
    slug: string;
    ownerUid: string; 
};

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    return (
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>{restaurant.name}</h3>
            <p style={styles.cardSlug}>Slug: {restaurant.slug}</p>
            {
                restaurant.ownerUid ? (
                    <ImpersonationButton uid={restaurant.ownerUid} />
                ) : (
                    <div style={styles.noUidMessage}>
                        (Usuario propietario no vinculado)
                    </div>
                )
            }
        </div>
    );
};

export default async function AdminPage() {

    const { currentUser, token } = await getAuthenticatedAppForUser();
    if (!currentUser || !token?.admin) {
        redirect('/');
    }

    let restaurants: Restaurant[] = [];
    try {
        const adminDb = getAdminDb();
        const restaurantsSnapshot = await adminDb.collection('restaurants').orderBy('restaurantName', 'asc').get();
        
        restaurants = restaurantsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.restaurantName || 'Nombre no definido',
                slug: data.slug || 'slug-no-definido',
                // CORRECTED: Check for 'ownerId' (from new sign-ups) and fall back to 'uid' (for old data).
                ownerUid: data.ownerId || data.uid || '' 
            };
        });
    } catch (error) {
        console.error('[Admin Page] Error fetching restaurants:', error);
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Panel de Administración</h1>
                <p style={styles.subtitle}>
                    Bienvenido, {currentUser.email}. Aquí puedes gestionar tus restaurantes clientes.
                </p>
            </header>
            
            <main style={styles.main}>
                <h2 style={styles.sectionTitle}>Restaurantes Registrados ({restaurants.length})</h2>
                {restaurants.length > 0 ? (
                    <div style={styles.grid}>
                        {restaurants.map(restaurant => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <p>No se encontraron restaurantes.</p>
                )}
            </main>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '2rem', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f7f9fc',
        minHeight: '100vh',
        color: '#333'
    },
    header: {
        marginBottom: '2rem',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '1rem'
    },
    title: { 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: '#1a202c', 
        margin: 0 
    },
    subtitle: {
        fontSize: '1.1rem', 
        color: '#555',
        marginTop: '0.5rem'
    },
    main: {
        width: '100%'
    },
    sectionTitle: {
        fontSize: '1.8rem', 
        fontWeight: 600,
        color: '#2d3748',
        marginBottom: '1.5rem'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
    },
    card: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column'
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        margin: '0 0 0.5rem 0'
    },
    cardSlug: {
        fontSize: '0.9rem',
        color: '#718096',
        margin: '0 0 1rem 0',
        fontFamily: 'monospace',
        flexGrow: 1
    },
    noUidMessage: {
        padding: '0.75rem 1rem',
        textAlign: 'center',
        backgroundColor: '#fefcbf',
        borderRadius: '6px',
        color: '#92400e',
        fontSize: '0.9rem',
        fontStyle: 'italic'
    }
};