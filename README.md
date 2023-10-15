# Basisdokument

_Master's thesis in M.Sc. Medieninformatik, winter semester 2023/2024_

_from: Erik Blank_

## About

This app enables lawyers to create their previous analogue correspondence in a digital environment. It offers a variety of useful features that aim to ease the process of working on cases while also making the process more time efficient. The app is based on the works of the last semester by [Hahn, Röhr & Sautmann (2021)](https://github.com/kindOfCurly/PS-Basisdokument/wiki/Projekt-Log), [Freisleben, Schwarz & Zels (2021)](https://elearning.uni-regensburg.de/mod/resource/view.php?id=2172773) and [Universität Regensburg (2023)](https://github.com/UniRegensburg/basisdokument). The Microsoft Word add-in allows to use the "Basisdokument" for lawyers also in Microsoft Word and allows them to create and edit a "Basisdokument".

## Context

In the context of my Master's thesis, I developed a Word add-in with the aim of enabling the use of the "Basisdokument" within Microsoft Word; this work serves as an exploratory investigation into the feasible implementation of the Basisdokument in Word, along with potential limitations.

## Motivation

The working group "Modernization of Civil Procedure" has "extensively examined how new technical possibilities can be used in civil procedure in order to make court procedures more citizen-friendly, efficient and resource-saving". [[1]](https://www.brak.de/newsroom/newsletter/nachrichten-aus-berlin/2021/ausgabe-2-2021-v-2712021/modernisierung-des-zivilprozesses-diskussionspapier-der-olg-praesidenten/)
The working group's proposal is a digital document that serves to structure the party speech and eases the communication process between parties.

## Running the project locally

To get started, download the project, `cd` into the root directory and install all dependencies using `npm install` or any other package manager of your choosing. After all dependencies have successfully been installed, you can run `npm run start` in your terminal which opens the app Microsoft Word and starts the application. It may be that the terminal must be run with administrator rights.
