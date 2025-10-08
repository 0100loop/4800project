
package com.project4800.test;

import org.junit.Test;
import static org.junit.Assert.*;

public class JunitTestingTest {
    @Test
    public void testExampleresult() {
        int result = testExample(2, 3);
        assertEquals(8, result);
    }

    public static int testExample(int a, int b) {
        return a + b * 2;
    }
}