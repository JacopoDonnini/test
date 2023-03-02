public class Pair {
    private int a;
    private int b;

    public Pair(int a, int b) {
        this.a = a;
        this.b = b;
    }
    public Pair(){
        a=0;
        b=0;
    }

    public int getB() {
        return b;
    }

    public int getA() {
        return a;
    }

    public void setB(int b) {
        this.b = b;
    }

    public void setA(int a) {
        this.a = a;
    }

    public int GetSum(){
        return a+b;
    }
}
