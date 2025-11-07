import styles from "./page.module.css";
import { prisma } from "@repo/db";
import {Button} from "@repo/ui/components/button";

export default async function Home() {
    const user = await prisma.user.findFirst()
    return (
        <div className={styles.page}>
            {user?.name ?? "No user added yet"}
            <Button>Waddup?</Button>
        </div>
    );
}