public class Main {
    public static void main(String[] args) {
        for(int i=0; i<5; i++) System.out.println("hello");
        Pair p0 = new Pair(1,5);
        Pair p1 = new Pair(2,10);
        Pair p2 = new Pair(3,15);
        Pair p3 = new Pair();
        System.out.println(p0.GetSum()+p1.GetSum()+ p2.GetSum()+ p3.GetSum());
    }
}
