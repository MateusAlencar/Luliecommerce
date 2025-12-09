import { Suspense } from "react";
import SignInClient from "./SignInClient";

export default function SignInPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <SignInClient />
        </Suspense>
    );
}
