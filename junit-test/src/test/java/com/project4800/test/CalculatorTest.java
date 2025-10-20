package com.project4800.test;

import org.junit.*;

public class CalculatorTest {

	private Calculator c;
	
	@Before
	public void setup() {
		System.out.println("Setup");
		c = new Calculator();
	}
	
	@After
	public void cleanup() {
		System.out.println("Cleanup");
	}
	
	@Test
	public void testSubtract(){
		int res = c.subtract(10, 5);
		Assert.assertEquals(5, res);
		
	}
	
	@Test
	public void testSubtract2(){
		int res = c.subtract(10, -5);
		Assert.assertEquals(15, res);
		
	}
	
	@Test
	public void testSubtract3(){
		int res = c.subtract(-10, -5);
		Assert.assertEquals(-5, res);
		
	}
}
