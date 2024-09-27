import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sellogic report',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: Scaffold(
          body: Expanded(
        child: Container(
          padding: const EdgeInsets.all(24),
          color: Colors.grey[800],
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                  flex: 1,
                  child: RoundedContainer(
                    color: Colors.purple[100],
                    child: const Center(
                      child: FittedBox(
                        child: Text(
                          'Sellogic report',
                          style: TextStyle(
                              fontSize: 100, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  )),
              const SizedBox(height: 10),
              Expanded(
                flex: 5,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(
                      flex: 1,
                      child: RoundedContainer(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: List.generate(
                            5,
                            (i) => Draggable(
                                data: i,
                                feedback: const Icon(Icons.circle, size: 50),
                                child: const Icon(Icons.circle, size: 50)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                        flex: 3, child: RoundedContainer(child: Text('World'))),
                  ],
                ),
              ),
            ],
          ),
        ),
      )),
    );
  }
}

class RoundedContainer extends StatelessWidget {
  const RoundedContainer({super.key, required this.child, this.color});

  final Widget child;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color ?? Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: const [
          BoxShadow(
            color: Colors.grey,
            blurRadius: 5,
            spreadRadius: 1,
          ),
        ],
      ),
      child: child,
    );
  }
}
