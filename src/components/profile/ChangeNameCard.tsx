import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

export function ChangeNameCard() {
    const { user, updateName } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!newName.trim()) return;

        setIsLoading(true);
        try {
            await updateName(newName);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update name:", error);
            // Optionally add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-brand-purple/10 p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Dados Pessoais</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
                    >
                        Alterar
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all outline-none"
                            placeholder="Seu nome completo"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewName(user.name);
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading || !newName.trim()}
                            className="px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-500 mb-1">Nome</p>
                    <p className="font-medium text-gray-900">{user.name}</p>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
