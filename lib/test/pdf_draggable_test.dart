import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'dart:typed_data';
import 'package:flutter/services.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Draggable PDF Generator',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Offset textPosition = const Offset(50, 50); // Initial position for the text
  Offset imagePosition =
      const Offset(100, 100); // Initial position for the image
  Uint8List? imageBytes; // Store the image data

  @override
  void initState() {
    super.initState();
    _loadImage(); // Load image when the widget is initialized
  }

  Future<void> _loadImage() async {
    final ByteData data =
        await NetworkAssetBundle(Uri.parse('https://via.placeholder.com/100'))
            .load('');
    setState(() {
      imageBytes = data.buffer.asUint8List();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Draggable PDF Generator'),
      ),
      body: Stack(
        children: [
          // PDF preview area where components are draggable
          Positioned.fill(
            child: Container(
              color: Colors.grey[300],
              child: Stack(
                children: [
                  Positioned(
                    left: textPosition.dx,
                    top: textPosition.dy,
                    child: Draggable(
                      feedback: Material(
                        color: Colors.transparent,
                        child: _buildTextWidget(),
                      ),
                      childWhenDragging: Container(),
                      onDragEnd: (details) {
                        setState(() {
                          textPosition = details.offset;
                        });
                      },
                      child: _buildTextWidget(),
                    ),
                  ),
                  Positioned(
                    left: imagePosition.dx,
                    top: imagePosition.dy,
                    child: Draggable(
                      feedback: Material(
                        color: Colors.transparent,
                        child: _buildImageWidget(),
                      ),
                      childWhenDragging: Container(),
                      onDragEnd: (details) {
                        setState(() {
                          imagePosition = details.offset;
                        });
                      },
                      child: _buildImageWidget(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Button to generate PDF
          Positioned(
            bottom: 20,
            right: 20,
            child: ElevatedButton(
              onPressed: _generatePdf,
              child: const Text('Download PDF'),
            ),
          ),
        ],
      ),
    );
  }

  // Build text widget
  Widget _buildTextWidget() {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Colors.yellow,
      child: const Text(
        'Draggable Text',
        style: TextStyle(fontSize: 18, color: Colors.black),
      ),
    );
  }

  // Build image widget
  Widget _buildImageWidget() {
    return imageBytes == null
        ? const CircularProgressIndicator()
        : Container(
            width: 100,
            height: 100,
            color: Colors.transparent,
            child: Image.memory(imageBytes!, fit: BoxFit.cover),
          );
  }

  // Generate PDF and print
  Future<void> _generatePdf() async {
    final pdf = pw.Document();

    // Load the custom font from assets
    final font =
        pw.Font.ttf(await rootBundle.load('assets/fonts/Roboto-Regular.ttf'));

    pdf.addPage(
      pw.Page(
        build: (pw.Context context) {
          return pw.Stack(
            children: [
              pw.Positioned(
                left: textPosition.dx,
                top: textPosition.dy,
                child: pw.Text(
                  'Draggable Text',
                  style: pw.TextStyle(font: font, fontSize: 18),
                ),
              ),
              pw.Positioned(
                left: imagePosition.dx,
                top: imagePosition.dy,
                child: imageBytes == null
                    ? pw.Container()
                    : pw.Image(
                        pw.MemoryImage(imageBytes!),
                        width: 100,
                        height: 100,
                      ),
              ),
            ],
          );
        },
      ),
    );

    // Use the printing package to allow download
    await Printing.sharePdf(
        bytes: await pdf.save(), filename: 'draggable_pdf.pdf');
  }
}
