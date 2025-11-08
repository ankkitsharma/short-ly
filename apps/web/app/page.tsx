import styles from "./page.module.css";
import { prisma } from "@repo/db";
import {Button} from "@repo/ui/components/button";

// Force dynamic rendering to avoid prerendering issues during build
export const dynamic = 'force-dynamic';

export default async function Home() {
    const user = await prisma.user.findFirst()
    return (
        <div className={styles.page}>
            {user?.name ?? "No user added yet"}
            <Button>Waddup?</Button>
        </div>
    );
}