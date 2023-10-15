import * as React from "react";
import { useState } from "react";
import "../index.css";
import Progress from "./components/Progress";
import { CaseProvider, SectionProvider, UserProvider } from "./contexts";
import { ExportProvider } from "./contexts/ExportContext";
import { HeaderProvider } from "./contexts/HeaderContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import Auth from "./pages/Auth";
import Main from "./pages/Main";
import "./theme/theme-style.css";
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
            <HeaderProvider>
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
            </HeaderProvider>
          </SectionProvider>
        </UserProvider>
      </OnboardingProvider>
    </>
  );
};

export default App;
