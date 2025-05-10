import { useState, createContext, useContext } from "react";

interface AlertContextType {
    showSuccess: boolean;
    showError: boolean;
    errorMessage: string;
    successMessage: string;
    handleShowSuccess: (message: string) => void;
    handleShowError: (message: string) => void;
    setShowSuccess: (show: boolean) => void;
    setShowError: (show: boolean) => void;
    setErrorMessage: (message: string) => void;
    setSuccessMessage: (message: string) => void;
}

const AlertContext = createContext<AlertContextType>({
    showSuccess: false,
    showError: false,
    errorMessage: "",
    successMessage: "",
    handleShowSuccess: () => {},
    handleShowError: () => {},
    setShowSuccess: () => {},
    setShowError: () => {},
    setErrorMessage: () => {},
    setSuccessMessage: () => {}
})

export const AlertProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
        const [showSuccess, setShowSuccess] = useState(false);
        const [showError, setShowError] = useState(false);
        const [errorMessage, setErrorMessage] = useState("An error occurred while generating the URL. Please try again.");
        const [successMessage, setSuccessMessage] = useState("URL generated successfully!");

        const handleShowSuccess = (message: string) => {
            setSuccessMessage(message);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          };
        
        const handleShowError = (message: string) => {
            setErrorMessage(message)
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        };

        return (
            <AlertContext.Provider value={{ showSuccess, showError, errorMessage, successMessage, handleShowSuccess, handleShowError, setShowSuccess, setShowError, setErrorMessage, setSuccessMessage }}>
                {children}
            </AlertContext.Provider>

        )
}

export const useAlertContext = () => useContext(AlertContext);