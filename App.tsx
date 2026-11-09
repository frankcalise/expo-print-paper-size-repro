import * as Print from 'expo-print';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const html = `<!doctype html>
<html>
  <head>
    <style>
      @page { size: 6in 4in; margin: 0 }
      body { margin: 0; font-family: -apple-system, sans-serif }
      .card { box-sizing: border-box; width: 6in; height: 4in; padding: 0.3in; border: 2px solid #333 }
      h1 { margin: 0 0 0.15in; font-size: 24pt }
      p { margin: 0 0 0.08in; font-size: 13pt }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>6 x 4 inch card</h1>
      <p>This page is 6 inches wide and 4 inches tall.</p>
      <p>On 4 x 6 paper it fills the sheet.</p>
      <p>On US Letter it is scaled up to fit.</p>
    </div>
  </body>
</html>`;

const card: Print.PrintOptions = {
  html,
  width: 576,
  height: 384,
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
};

const preferredPaperSize: Print.PaperSize = { width: 432, height: 288 };

function printCard(options: Print.PrintOptions) {
  Print.printAsync(options).catch((error) => console.warn(error));
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const [printer, setPrinter] = useState<Print.Printer>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Print dialog</Text>
      <Text style={styles.hint}>
        Select a printer that reports 4 x 6 paper, then compare the Paper Size each button
        preselects.
      </Text>
      <Button label="Print 4x6 (default)" onPress={() => printCard(card)} />
      <Button
        label="Print 4x6 with preferredPaperSize"
        onPress={() => printCard({ ...card, preferredPaperSize })}
      />
      <Text style={styles.heading}>No dialog (printerUrl)</Text>
      <Text style={styles.hint}>
        {printer ? `Printer: ${printer.name}` : 'No printer selected'}
      </Text>
      <Button
        label="Select printer"
        onPress={() =>
          Print.selectPrinterAsync()
            .then(setPrinter)
            .catch((error) => console.warn(error))
        }
      />
      {printer && (
        <>
          <Button
            label="Print 4x6 to printer (default)"
            onPress={() => printCard({ ...card, printerUrl: printer.url })}
          />
          <Button
            label="Print 4x6 to printer with preferredPaperSize"
            onPress={() =>
              printCard({
                ...card,
                printerUrl: printer.url,
                preferredPaperSize,
              })
            }
          />
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  hint: { fontSize: 16, textAlign: 'center' },
  button: { padding: 16, borderRadius: 8, backgroundColor: '#1f6feb' },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
