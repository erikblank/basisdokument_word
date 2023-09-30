import "../index.css";
import "./theme/theme-style.css";
import * as React from "react";
import { useState } from "react";
import Auth from "./pages/Auth";
import Main from "./pages/Main";
import Progress from "./components/Progress";
import { CaseProvider, SectionProvider, UserProvider } from "./contexts";
import { SidebarProvider } from "./contexts/SidebarContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ExportProvider } from "./contexts/ExportContext";
/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App = ({ isOfficeInitialized, title }: AppProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const click = async () => {
    return Word.run(async (context) => {
      const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

      paragraph.font.color = "blue";

      await context.sync();
    });
  };

  return (
    <>
      <OnboardingProvider>
        <UserProvider>
          <SectionProvider>
            <CaseProvider>
              <SidebarProvider>
                <ExportProvider>
                  {!isOfficeInitialized && (
                    <Progress
                      title={title}
                      logo={require("./../../assets/logo-filled.png")}
                      message="Please sideload your addin to see app body."
                      click={click}
                    />
                  )}
                  {isOfficeInitialized && !isAuthenticated && <Auth setIsAuthenticated={setIsAuthenticated} />}
                  {isOfficeInitialized && isAuthenticated && <Main />}
                </ExportProvider>
              </SidebarProvider>
            </CaseProvider>
          </SectionProvider>
        </UserProvider>
      </OnboardingProvider>
    </>
  );
};

export default App;
